import { CircularProgress } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useEffect } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  ListRowRenderer,
  WindowScroller,
} from 'react-virtualized'
import PageSpinner from '../PageSpinner'
import constants from '../../constants'

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

  const isRowLoaded = ({ index }: { index: number }) =>
    !moreToLoad || index < items.length

  const handleLoadMoreRows = async () => {
    const itemsLength = items.length
    await onLoadMore()

    // clears height cache of spinner cell
    cellMeasurerCache.clear(itemsLength, 0)
  }

  useEffect(() => {
    cellMeasurerCache.clearAll()
  }, [cacheKey])

  const rowRenderer: ListRowRenderer = ({ index, key, style, parent }) => {
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
          <div
            // @ts-ignore
            ref={registerChild}
            style={style}
          >
            <div onLoad={measure}>
              {isRowLoaded({ index }) && items[index]
                ? render(items[index])
                : renderLoader(moreToLoad)}
            </div>
          </div>
        )}
      </CellMeasurer>
    )
  }

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
      {({ onRowsRendered, registerChild }) => (
        // @ts-ignore
        <WindowScroller>
          {({ height, scrollTop }) => (
            // @ts-ignore
            <AutoSizer disableHeight>
              {({ width }) => (
                // @ts-ignore
                <List
                  autoHeight
                  deferredMeasurementCache={cellMeasurerCache}
                  height={height}
                  onRowsRendered={onRowsRendered}
                  overscanRowCount={VIRTUALIZED_OVERSCAN_ROW_COUNT}
                  ref={registerChild}
                  rowCount={rowCount}
                  rowHeight={cellMeasurerCache.rowHeight}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  )
}

export default ContentList
