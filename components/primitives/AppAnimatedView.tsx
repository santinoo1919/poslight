import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleProp, Easing } from "react-native";

type Transition = {
  opacity?: number;
  scale?: number;
  translateY?: number;
};

interface AppAnimatedViewProps {
  visible: boolean;
  duration?: number;
  easing?: (value: number) => number;
  from?: Transition;
  to?: Transition;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children: React.ReactNode;
}

export default function AppAnimatedView({
  visible,
  duration = 180,
  easing = Easing.linear,
  from = { opacity: 0, scale: 0.96, translateY: 12 },
  to = { opacity: 1, scale: 1, translateY: 0 },
  style,
  className,
  children,
}: AppAnimatedViewProps) {
  const opacity = useRef(new Animated.Value(from.opacity ?? 1)).current;
  const scale = useRef(new Animated.Value(from.scale ?? 1)).current;
  const translateY = useRef(new Animated.Value(from.translateY ?? 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: (visible ? to.opacity : from.opacity) ?? 1,
        duration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: (visible ? to.scale : from.scale) ?? 1,
        duration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: (visible ? to.translateY : from.translateY) ?? 0,
        duration,
        easing,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    visible,
    duration,
    easing,
    from.opacity,
    from.scale,
    from.translateY,
    to.opacity,
    to.scale,
    to.translateY,
    opacity,
    scale,
    translateY,
  ]);

  return (
    <Animated.View
      className={className}
      style={[
        style,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
