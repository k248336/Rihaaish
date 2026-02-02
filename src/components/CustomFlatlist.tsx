import React, { useCallback, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  ViewStyle,
  StyleSheet,
  FlatListProps,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { getAppStyles } from '../utilities';
import useAppSelector from '../hooks/useAppSelector';
import { heightPixel, widthPixel } from '../utilities/helpers';
import EmptyComp from './EmptyComp';
import { useTheme } from '../hooks';

interface CustomFlatlistProps extends FlatListProps<any> {
  ref?: any;
  data: any[];
  renderItem: any;
  noDataTitle?: string;
  noDataDescription?: string;
  paginationData?: any;
  ItemSeparatorComponent?: any;
  onRefreshList?: () => void;
  onLoadMoreData?: (params: any) => void;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  customStyle?: ViewStyle | Array<ViewStyle>;
}

export default function CustomFlatlist(props: CustomFlatlistProps) {
  const {
    data,
    noDataTitle,
    noDataDescription,
    ItemSeparatorComponent,
    onRefreshList,
    containerStyle,
    customStyle,
    paginationData,
    onLoadMoreData,
  } = props;
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const loading = useAppSelector(state => state.loader.isVisible);

  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const onLoadMore = useCallback(async () => {
    if (
      isFetching ||
      data?.length === 0 ||
      paginationData?.next <= 0 ||
      paginationData?.next > paginationData?.total
    ) {
      return;
    }

    setIsFetching(true);
    await onLoadMoreData?.({ page: paginationData?.next });
    setIsFetching(false);
  }, [isFetching, paginationData]);

  const EmptyComponent = () => (
    <EmptyComp
      title={noDataTitle || 'No Data Found!'}
      description={noDataDescription || ''}
    />
  );

  const FooterComponent = () => (
    <View style={dynamicStyles(colors).loadMoreContainer}>
      <ActivityIndicator size="small" color={colors.white} />
    </View>
  );

  return (
    <FlatList
      onEndReachedThreshold={0.4}
      onEndReached={onLoadMore}
      style={customStyle}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparatorComponent}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={[dynamicStyles(colors).flatListStyle, containerStyle]}
      ListEmptyComponent={() => !loading && !refreshing && <EmptyComponent />}
      ListFooterComponent={() =>
        !loading && isFetching && data?.length !== 0 && <FooterComponent />
      }
      refreshControl={
        onRefreshList && (
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.white} //for ios only
            colors={[colors.white]} //for android only
            progressBackgroundColor={colors.primary} //for android only
            onRefresh={async () => {
              setRefreshing(true);
              await onRefreshList();
              setTimeout(() => {
                setRefreshing(false);
              }, 500);
            }}
            // title="Pull to Refresh" //for ios only
            // titleColor={colors.primary} //for ios only
          />
        )
      }
      {...props}
    />
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    flatListStyle: {
      flexGrow: 1,
      paddingTop: heightPixel(5),
      paddingBottom: heightPixel(30),
      paddingHorizontal: widthPixel(15),
      backgroundColor: colors.white,
    },
    loadMoreContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: heightPixel(10),
    },
  });
