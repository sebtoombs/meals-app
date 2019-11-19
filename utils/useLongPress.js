import { useState, useEffect } from "react";
//TODO turn this into a HOC

/*export default function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress]);

  const onEventStart = () => {
    setStartLongPress(true);
  };
  const onEventEnd = () => {
    setStartShortPress(false);
  };

  return {
    onMouseDown: onEventStart,
    onMouseUp: onEventEnd,
    onMouseLeave: onEventEnd,
    onTouchStart: onEventStart,
    onTouchEnd: onEventEnd
  };
}
*/

export default function useLongPress({
  onClick = null,
  onLongPress = null,
  ms = 300
}) {
  const [pressed, setPressed] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const [moved, setMoved] = useState(false);

  const longPressCb = onLongPress;
  const shortPressCb = onClick ? onClick : false;

  const onEventStart = e => {
    /*var touch =
      e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
    //e = touch || e;*/
    //console.log(e.pageX, e.pageY);

    setMoved(false);
    setPressed(true);
  };
  const onEventEnd = e => {
    if (pressed && !moved) {
      shortPressHandler(e);
      setPressed(false);
    }
  };

  const longPressHandler = () => {
    longPressCb.call(null);
    setLongPress(true);
  };

  const shortPressHandler = e => {
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
    }
  };
  /*return class extends React.Component {
    render() {
      let passProps = this.props;
      return (
        <WrappedComponent
          {...passProps}
          onMouseDown={onEventStart}
          onMouseUp={onEventEnd}
          onMouseLeave={onEventEnd}
          onTouchStart={onEventStart}
          onTouchEnd={onEventEnd}
        />
      );
    }
  };*/
}
