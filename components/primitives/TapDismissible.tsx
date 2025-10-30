import React from "react";
import {
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";

interface TapDismissibleProps extends ViewProps {
  children: React.ReactNode;
}

export default function TapDismissible({
  children,
  ...rest
}: TapDismissibleProps) {
  // On native: tap outside to dismiss keyboard
  if (Platform.OS !== "web") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View {...rest}>{children}</View>
      </TouchableWithoutFeedback>
    );
  }

  // On web: don't intercept clicks; let inputs receive focus
  return <View {...rest}>{children}</View>;
}
