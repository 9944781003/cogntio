/* eslint-disable prettier/prettier */
import {NavigatorScreenParams} from '@react-navigation/native';

export type HomeTabParamList = {
  Popular: undefined;
  Latest: undefined;
};
export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  PostDetails: {id: string};
  NotFound: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
