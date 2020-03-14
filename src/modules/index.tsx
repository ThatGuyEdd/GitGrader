import { CssBaseline, Paper } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { CanvasBackend as Canvas, GitlabBackend as GL } from '../api';
import { ICanvasClass } from '../api/interfaces';
import { BackButton, CourseList, SettingsButton } from './navs';
import { SetUp } from './settings';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL({
  gitlab_host: 'https://git-classes.mst.edu',
  gitlab_token: '',
  namespace: '2020-senior-test'
});

const CanvasAPI = new Canvas({
  canvas_url: 'https://mst.instructure.com',
  canvas_token: '2006~rBsdDmvmuKgD629IaBL9zKZ3Xe1ggXHhcFWJH4eEiAgE62LUWemgbVrabrx116Rq'
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  }
});

// GitLabAPI.createAssignment(
//   'hw1',
//   '2453',
//   '001',
//   '2020-SP',
//   'mrmk8'
// )
// .then(assignment => {
//   GitLabAPI.getUserId('mrmk8')
//     .then(user => {
//       GitLabAPI.assignAssignment(assignment.id, user.id)
//         .then(console.log)
//         .catch(console.error);
//     })
//     .catch(console.error);
// })
// .catch(console.error);

// CanvasAPI.getStudents('42771')
//   .then(console.log)
//   .catch(console.error);

// CanvasAPI.getStudents('42771')
//   .then(console.log)
//   .catch(console.error);

/* GitLabAPI.lockAssignment('', '')
  .then(console.log)
  .catch(console.error); */

/* canvas.getStudents('')
  .then(console.log)
  .catch(console.error);
 */

// TODO : This needs to be an actual page/component
const CoursePage = (obj: { match: any; location: any }) => {
  return <p>{obj.match.params.courseId}</p>;
};

export const App = () => {
  const [courses, setCourses] = React.useState<ICanvasClass[]>();

  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    console.log('beep boop');
    setTheme(theme == 'dark' ? 'light' : 'dark');
  }

  // We need the data from canas so on initial render let's try.
  React.useEffect(() => {
    CanvasAPI.getClasses()
      .then(classes => {
        setCourses(classes);
      })
      .catch(console.error);
      // The CanvasAPI won't change so this prevents re-rendering.
  }, [CanvasAPI]);

  return (
    <ThemeProvider theme={theme == 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <BackButton />
      <SettingsButton />
      <Switch>
        <Route
          exact
          path='/'
          key='courses'
          render={() => 
            <>
              {courses ? 
              <CourseList courses={courses}/> :
              <p>No Courses loaded yet</p>}
            </>
          }
          />
        <Route
          exact
          path='/settings'
          key='settings'
          render={() => <SetUp toggleTheme={toggleTheme}/>}
          />
        <Route 
          exact 
          path='/course/:courseId' 
          component={CoursePage} 
          />
        <Route
          key='error'
          render={() => (
            <Link to='/'>
              <p>Route not found!</p>
            </Link>
          )}
          />
      </Switch>
    </ThemeProvider>
  );
};
