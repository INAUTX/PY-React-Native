import React from 'react';
import {Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

const OnboardingScreen: React.FC<Props> = ({navigation}) => (
  <Onboarding
    onSkip={() => navigation.replace('Contacts')}
    onDone={() => navigation.replace('Contacts')}
    pages={[
      {
        backgroundColor: '#fff',
        image: <Image source={require('../assets/images/Screenshot_1.png')} />,
        title: 'Bienvenido',
        subtitle: 'Primera pantalla',
      },
      {
        backgroundColor: '#fdeb93',
        image: <Image source={require('../assets/images/Screenshot_2.png')} />,
        title: 'Funcionalidad',
        subtitle: 'segunda pantalla',
      },
    ]}
  />
);

export default OnboardingScreen;
