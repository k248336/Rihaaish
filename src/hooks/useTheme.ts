
import useAppSelector from './useAppSelector';
import { getColors } from '../utilities/constants';
import { RootState } from '../interface';

export const useTheme = () => {
  const isDarkMode = useAppSelector((state: RootState) => state.theme.isDarkMode);

  const colors = getColors(isDarkMode);

  return { isDarkMode, colors };
};


