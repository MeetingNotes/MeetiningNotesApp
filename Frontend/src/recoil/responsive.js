import { atom, selector } from 'recoil';

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;
const PORTRAIT_ASPECT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT;
const MOBILE_MAX_WIDTH = 576;
const SUPER_MOBILE_WIDTH = 960;
const HEADER_HEIGHT_DESKTOP = 93;
const HEADER_HEIGHT_MOBILE = 80;

const getDimensions = () => ({
  width: +window.innerWidth || DEFAULT_WIDTH,
  height: +window.innerHeight || DEFAULT_HEIGHT
});

const windowResize = ({ setSelf }) => {

  const resizeHandler = () => {
    setSelf(getDimensions());
  };

  window.addEventListener('resize', resizeHandler);

  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
};

const windowSize = atom({
  key: 'windowSize',
  default: getDimensions(),
  effects: [windowResize]
});

const useIsLandscape = selector({
  key: 'useIsLandscape',
  get: ({ get }) => {
    const { width, height } = get(windowSize);
    return width > height;
  }
});

export const useWindowSize = selector({
  key: 'useWindowSize',
  get: ({ get }) => get(windowSize)
});

export const useWindowWidth = selector({
  key: 'useWindowWidth',
  get: ({ get }) => get(windowSize).width
});

export const useWindowHeight = selector({
  key: 'useWindowHeight',
  get: ({ get }) => get(windowSize).height
});

export const useAspectRatio = selector({
  key: 'useAspectRatio',
  get: ({ get }) => {
    const size = get(windowSize);
    return size.width / size.height;
  }
});

export const useIsPortrait = selector({
  key: 'useIsPortrait',
  get: ({ get }) => get(useAspectRatio) < PORTRAIT_ASPECT_RATIO
});


export const useIsMobileLandscape = selector({
  key: 'useIsMobileLandscape',
  get: ({ get }) => {
    const isMobile = get(useIsMobile);
    const isLandscape = get(useIsLandscape);
    return isMobile && isLandscape;
  }
});

export const useIsMobile = selector({
  key: 'useIsMobile',
  get: ({ get }) => get(windowSize).width < MOBILE_MAX_WIDTH
});

export const useHeaderHeight = selector({
  key: 'useHeaderHeight',
  get: ({ get }) => get(useIsMobile) ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT_DESKTOP
});

export const isTouchDevice = (('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0));

export const useIsSuperMobile = selector({
  key: 'useIsSuperMobile',
  get: ({ get }) => get(windowSize).width < SUPER_MOBILE_WIDTH
});