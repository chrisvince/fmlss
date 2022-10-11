import { CircularProgress, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { LegacyRef, useCallback } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  ListRowRenderer,
  WindowScroller,
} from 'react-virtualized'

import constants from '../../constants'
import useOnWindowResize from '../../utils/useOnWindowResize'

const { INFINITY_LOADING_THRESHOLD, VIRTUALIZED_OVERSCAN_ROW_COUNT } = constants
interface PropTypes {
  cellMeasurerCache: CellMeasurerCache
  children: (item: any, index: number) => JSX.Element
  items: any[]
  moreToLoad: boolean
  onLoadMore: () => Promise<any>
}

const ContentList = ({
  cellMeasurerCache,
  children: render,
  items,
  moreToLoad,
  onLoadMore,
}: PropTypes) => {
  const theme = useTheme()
  const disableClearCellCacheOnResize = useMediaQuery('(min-width: 1300px)')

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => !moreToLoad || index < items.length,
    [items.length, moreToLoad]
  )

  const handleLoadMoreRows = async () => {
    await onLoadMore()
    cellMeasurerCache.clearAll()
  }

  useOnWindowResize(() => cellMeasurerCache.clearAll(), {
    disable: disableClearCellCacheOnResize,
  })

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const renderLoader = (moreToLoad: boolean) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: moreToLoad ? '60px' : theme.spacing(4),
          }}
        >
          {moreToLoad && <CircularProgress size={22} />}
        </Box>
      )

      return (
        // @ts-ignore
        <CellMeasurer
          cache={cellMeasurerCache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          {({ measure, registerChild }) => (
            <div ref={registerChild as LegacyRef<HTMLDivElement>} style={style}>
              <div onLoad={measure}>
                {isRowLoaded({ index }) && items[index]
                  ? render(items[index], index)
                  : renderLoader(moreToLoad)}
              </div>
            </div>
          )}
        </CellMeasurer>
      )
    },
    [cellMeasurerCache, isRowLoaded, items, moreToLoad, render, theme]
  )

  return (
    // @ts-ignore
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleLoadMoreRows}
      rowCount={items.length}
      threshold={INFINITY_LOADING_THRESHOLD}
    >
      {({ onRowsRendered, registerChild: infiniteLoaderRef = () => {} }) => (
        // @ts-ignore
        <WindowScroller>
          {({
            height,
            scrollTop,
            registerChild: windowScrollerRef = () => {},
          }) => (
            // @ts-ignore
            <AutoSizer disableHeight>
              {({ width }) => (
                <div ref={windowScrollerRef as LegacyRef<HTMLDivElement>}>
                  {/* @ts-ignore */}
                  <List
                    autoHeight
                    deferredMeasurementCache={cellMeasurerCache}
                    height={height}
                    onRowsRendered={onRowsRendered}
                    overscanRowCount={VIRTUALIZED_OVERSCAN_ROW_COUNT}
                    ref={infiniteLoaderRef}
                    rowCount={items.length}
                    rowHeight={cellMeasurerCache.rowHeight}
                    rowRenderer={rowRenderer}
                    scrollTop={scrollTop}
                    width={width}
                  />
                </div>
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  )
}

export default ContentList
