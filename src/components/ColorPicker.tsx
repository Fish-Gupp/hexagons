import React, { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { createUseStyles } from 'react-jss';
import OutsideClickHandler from 'react-outside-click-handler';

const useStyles = createUseStyles({
  popup: {
    left: (props) => props.left,
    position: 'absolute',
    top: 30,
    zIndex: 10,
  },
  preview: {
    backgroundColor: (props) => props.color,
    border: '1px solid black',
    height: 20,
    width: 30,
  },
  wrapper: {
    margin: 10,
    position: 'relative',
    width: 30,
  },
});

const ColorPicker = ({
  color,
  onChange,
  editable,
}: {
  color: string;
  editable: boolean;
  onChange: (color: string) => void;
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const screenOffset = () => {
    const previewElement = previewRef.current;
    if (!previewElement) return 0;
    const left = previewElement.getBoundingClientRect().left;
    const screenWidth = window.innerWidth;
    const pickerWidth =
      previewElement.parentElement?.children[1]?.clientWidth || 220;
    if (left + pickerWidth + 10 > screenWidth) {
      return screenWidth - (left + pickerWidth + 10);
    }
    return 0;
  };

  const classes = useStyles({ color, left: screenOffset() });

  return (
    <div className={classes.wrapper}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setOpen(false);
        }}
      >
        <div
          onClick={() => {
            if (!editable) return;
            setOpen(!open);
          }}
          ref={previewRef}
          className={classes.preview}
        ></div>
        {open && (
          <SketchPicker
            className={classes.popup}
            color={color}
            onChange={(e) => {
              onChange(e.hex);
            }}
          />
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default ColorPicker;
