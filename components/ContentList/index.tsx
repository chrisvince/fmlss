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
  children: (item: unknown, index: number) => JSX.Element
  items: unknown[]
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <CellMeasurer
          cache={cellMeasurerCache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          {({ registerChild }) => (
            <div
              className="content-list-item"
              ref={registerChild as LegacyRef<HTMLDivElement>}
              style={style}
            >
              {isRowLoaded({ index }) && items[index]
                ? render(items[index], index)
                : renderLoader(moreToLoad)}
            </div>
          )}
        </CellMeasurer>
      )
    },
    [cellMeasurerCache, isRowLoaded, items, moreToLoad, render, theme]
  )

  return (
    <Box sx={{ pb: 4 }}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={handleLoadMoreRows}
        rowCount={items.length}
        threshold={INFINITY_LOADING_THRESHOLD}
      >
        {({ onRowsRendered, registerChild: infiniteLoaderRef }) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <WindowScroller>
            {({ height, scrollTop, registerChild: windowScrollerRef }) => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div ref={windowScrollerRef as LegacyRef<HTMLDivElement>}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
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
    </Box>
  )
}

export default ContentList
