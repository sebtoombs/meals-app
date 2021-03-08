import { useState, useEffect } from "react";

export default function useLongPress({
  onClick = null,
  onLongPress = null,
  ms = 300,
}) {
  const [pressed, setPressed] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const [moved, setMoved] = useState(false);

  const longPressCb = onLongPress;
  const shortPressCb = onClick ? onClick : false;

  const onEventStart = (e) => {
    setMoved(false);
    setPressed(true);
  };
  const onEventEnd = (e) => {
    if (pressed && !moved) {
      shortPressHandler(e);
      setPressed(false);
    }
  };

  const longPressHandler = () => {
    longPressCb.call(null);
    setLongPress(true);
  };

  const shortPressHandler = (e) => {
    if (longPress) return;
    if (shortPressCb) shortPressCb.call(null, e);
  };

  //Watch for press
  useEffect(() => {
    setLongPress(false);
    let timerId;
    if (pressed) {
      timerId = setTimeout(longPressHandler, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [pressed]);

  return {
    onMouseDown: onEventStart,
    onMouseUp: onEventEnd,
    onMouseLeave: onEventEnd,
    onTouchStart: onEventStart,
    onTouchEnd: onEventEnd,
    onTouchMove: () => {
      setMoved(true);
      setPressed(false);
    },
  };
}
