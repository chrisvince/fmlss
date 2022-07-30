import { CircularProgress, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { LegacyRef, Ref, useCallback, useEffect } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  ListRowRenderer,
  WindowScroller,
} from 'react-virtualized'
import { mergeRefs } from 'react-merge-refs'

import PageSpinner from '../PageSpinner'
import constants from '../../constants'
import useOnWindowResize from '../../utils/useOnWindowResize'

const { INFINITY_LOADING_THRESHOLD, VIRTUALIZED_OVERSCAN_ROW_COUNT } = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 146.2,
})

interface PropTypes {
  cacheKey: string
  isLoading: boolean
  items: any[]
  moreToLoad: boolean
  onLoadMore: () => Promise<any>
  children: (item: any) => JSX.Element
}

const ContentList = ({
  cacheKey,
  isLoading,
  items,
  moreToLoad,
  onLoadMore,
  children: render,
}: PropTypes) => {
  const theme = useTheme()
  const rowCount = items.length + 1
  const disableClearCellCacheOnResize = useMediaQuery('(min-width: 1300px)')

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => !moreToLoad || index < items.length,
    [items.length, moreToLoad]
  ) 

  const handleLoadMoreRows = async () => {
    await onLoadMore()
    cellMeasurerCache.clearAll()
  }

  useEffect(() => {
    cellMeasurerCache.clearAll()
  }, [cacheKey])

  useOnWindowResize(
    () => cellMeasurerCache.clearAll(),
    { disable: disableClearCellCacheOnResize }
  )

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
                  ? render(items[index])
                  : renderLoader(moreToLoad)}
              </div>
            </div>
          )}
        </CellMeasurer>
      )
    },
    [isRowLoaded, items, moreToLoad, render, theme]
  )

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    // @ts-ignore
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleLoadMoreRows}
      rowCount={rowCount}
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
                    rowCount={rowCount}
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
