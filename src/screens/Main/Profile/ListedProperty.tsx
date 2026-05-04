import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import FavoriteProjectCard from '../../../components/FavoriteProjectCard';
import { heightPixel } from '../../../utilities/helpers';
import { AlertModal, CustomFlatlist, CustomText } from '../../../components';
import { getAppStyles, icons, screens, strings, utility } from '../../../utilities';
import { useAppDispatch, useAppSelector, useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import {
  deleteProperty,
  fetchMyListedProperties,
  hideLoader,
  showLoader,
} from '../../../redux/slices';
import {
  ListedPropertyCard,
  toListedPropertyCard,
} from './listedPropertyMapping';

type ListedRow = {
  card: ListedPropertyCard;
  /** Full API object — passed to Add Property for edit */
  raw: Record<string, unknown>;
};

export default function ListedProperty() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { userInfo } = useAppSelector(s => s.auth);
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const [rows, setRows] = useState<ListedRow[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!userInfo?.id) {
        setRows([]);
        return;
      }
      const silent = options?.silent === true;
      if (!silent) {
        dispatch(showLoader());
      }
      try {
        const apiRows = await dispatch(fetchMyListedProperties()).unwrap();
        setRows(
          (apiRows as Record<string, unknown>[]).map(raw => ({
            raw,
            card: toListedPropertyCard(raw),
          })),
        );
      } catch {
        setRows([]);
      } finally {
        if (!silent) {
          dispatch(hideLoader());
        }
      }
    },
    [dispatch, userInfo?.id],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const askDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const runDelete = async () => {
    if (!deleteId) {
      return;
    }
    const id = deleteId;
    setDeleteOpen(false);
    setDeleteId(null);

    dispatch(showLoader());
    try {
      await dispatch(deleteProperty(id)).unwrap();
      utility.showAlertMessage('success', strings.propertyDeletedSuccessfully);
      await refresh({ silent: true });
    } catch (err: any) {
      const msg =
        err?.message ??
        err?.detail ??
        (typeof err === 'string' ? err : strings.somethingWentWrong);
      utility.showAlertMessage('danger', String(msg));
    } finally {
      dispatch(hideLoader());
    }
  };

  const goEdit = (raw: Record<string, unknown>) => {
    navigation.navigate(screens.AddProperty, { property: raw });
  };

  return (
    <View style={[appStyles.container, { backgroundColor: colors.background }]}>
      {rows.length === 0 ? (
        <View style={styles.empty}>
          <CustomText color={colors.greaytext} fontSize={14}>
            {t('noDataFound')}
          </CustomText>
        </View>
      ) : (
        <CustomFlatlist
          data={rows}
          keyExtractor={item => item.card.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: ListedRow }) => (
            <FavoriteProjectCard
              item={item.card}
              listedProperty
              isFavorite={false}
              onPressDelete={() => askDelete(item.card.id)}
              onPressEdit={() => goEdit(item.raw)}
            />
          )}
        />
      )}

      <AlertModal
        title="DeleteProperties"
        subText="deletepropertydes"
        logoImage={icons.deleteicon}
        showCrossIcon
        backgroundcolor={colors.redOpacity}
        checkboxlabel=""
        check={false}
        setCheck={() => {}}
        visible={deleteOpen}
        confirmBtnTitle="Yes"
        onConfirm={runDelete}
        setVisible={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: 15,
    marginTop: heightPixel(15),
  },
  empty: {
    paddingTop: heightPixel(40),
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});
