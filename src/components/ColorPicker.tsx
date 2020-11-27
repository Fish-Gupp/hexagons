import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { createUseStyles } from 'react-jss';
import OutsideClickHandler from 'react-outside-click-handler';

const useStyles = createUseStyles({
  popup: {
    position: 'absolute',
    right: 'calc(50% - 110px)',
  },
  preview: {
    backgroundColor: (props) => props.color,
    border: '1px solid black',
    height: 20,
    margin: 10,
    width: 30,
  },
  wrapper: {
    position: 'relative',
  },
});

const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [newColor, setNewColor] = useState(color);
  const classes = useStyles({ color });

  return (
    <div className={classes.wrapper}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setOpen(false);
        }}
      >
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className={classes.preview}></div>
        </div>
        {open && (
          <SketchPicker
            className={classes.popup}
            color={newColor}
            onChange={(e) => {
              setNewColor(e.hex);
            }}
          />
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default ColorPicker;
