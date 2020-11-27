import React from 'react';
import { createUseStyles } from 'react-jss';
import Footer from '../components/Footer';
import Header from '../components/Header';

const useStyles = createUseStyles({
  layout: {
    padding: '15px;',
  },
});

function Layout(props: { children: any }): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
