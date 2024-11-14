import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface FractalAnimationProps {
  type: string;
  zoom: string;
  colorScheme: string;
  speed: string;
}

const FractalAnimation = ({ type, zoom, colorScheme, speed }: FractalAnimationProps) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(parseFloat(zoom));

  useEffect(() => {
    // Animation de rotation continue
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000 / parseFloat(speed),
        easing: Easing.linear,
      }),
      -1, // répétition infinie
      false // pas d'inversion
    );

    // Animation de pulsation
    scale.value = withRepeat(
      withTiming(parseFloat(zoom) * 1.2, {
        duration: 3000,
        easing: Easing.inOut(Easing.sine),
      }),
      -1, // répétition infinie
      true // inversion
    );
  }, [speed, zoom]);

  // Génération du chemin fractal en fonction du type
  const generateFractalPath = (type: string) => {
    switch (type) {
      case 'mandelbrot':
        return `M ${width/2} ${height/2} 
                C ${width/4} ${height/4} ${width*3/4} ${height/4} ${width/2} ${height/2}
                C ${width/4} ${height*3/4} ${width*3/4} ${height*3/4} ${width/2} ${height/2}`;
      case 'julia':
        return `M ${width/2} ${height/2} 
                Q ${width/4} ${height/4} ${width/2} 0
                Q ${width*3/4} ${height/4} ${width} ${height/2}
                Q ${width*3/4} ${height*3/4} ${width/2} ${height}
                Q ${width/4} ${height*3/4} 0 ${height/2}
                Q ${width/4} ${height/4} ${width/2} 0`;
      default:
        return `M ${width/2} ${height/2} L ${width/2} 0 L ${width} ${height/2} L ${width/2} ${height} L 0 ${height/2} Z`;
    }
  };

  // Couleurs en fonction du schéma
  const getGradientColors = (scheme: string) => {
    switch (scheme) {
      case 'blue':
        return ['#8EC5FC', '#E0C3FC'];
      case 'pink':
        return ['#F0A6CA', '#EEC4D8'];
      case 'green':
        return ['#B8E986', '#7ED321'];
      case 'yellow':
        return ['#FFDD8A', '#FFB347'];
      case 'orange':
        return ['#FFA07A', '#FF7F50'];
      case 'peach':
        return ['#FFDAB9', '#FFB6C1'];
      default:
        return ['#8EC5FC', '#E0C3FC'];
    }
  };

  const colors = getGradientColors(colorScheme);

  const animatedProps = useAnimatedProps(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <AnimatedPath
        d={generateFractalPath(type)}
        fill="none"
        stroke={colors[0]}
        strokeWidth={2}
        animatedProps={animatedProps}
      />
      <AnimatedPath
        d={generateFractalPath(type)}
        fill="none"
        stroke={colors[1]}
        strokeWidth={2}
        animatedProps={animatedProps}
        opacity={0.5}
      />
    </Svg>
  );
};

export default FractalAnimation;