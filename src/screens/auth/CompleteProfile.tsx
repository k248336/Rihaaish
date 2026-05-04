import React from 'react';
import { CustomScrollView, HeadingComp } from '../../components';
import { useTheme } from '../../hooks';

export default function CompleteProfile() {
  const { colors } = useTheme();

  return (
    <CustomScrollView>
      <HeadingComp
        title="Create Your Profile"
        subTitle={`experience our Learning`}
        titleTxtSize={22}
        subTitleTxtSize={14}
        titleTxtColor={colors.primary}
        subTitleTxtColor={colors.greaytext}
        titletxtWeight="bold"
        subTitleTxtWeight="regular"
      />
    </CustomScrollView>
  );
}
