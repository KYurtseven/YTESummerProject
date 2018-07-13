import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

export const theme = createMuiTheme({
    palette: {
      primary: {
        main: red.A400,
        contrastText: '#000',
      },
      secondary:{
        main: indigo["400"],
        contrastText: '#fff'
      },
      text:{
        main: pink.A200,
      }
    },
  });
