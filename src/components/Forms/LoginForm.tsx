import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import TextField from '../UI/Forms-UI/TextField';
import Button from '../UI/Forms-UI/Button';
import AuthContext from '../../store/auth-context';

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
    textAlign: 'center'
  }
}));

const INITIAL_FORM_STATE = {
  email: '',
  password: ''
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email('Invalid email.').required('Required'),
  password: Yup.string().required('Required')
});

const LoginForm: React.FC = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Container maxWidth="md">
            <div className={classes.formWrapper}>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values) => {
                  fetch(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBKUadWbfl-g3mGKyg8RY8cvnGpCKnh8oI',
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                        returnSecureToken: true
                      }),
                      headers: {
                        'Content-type': 'application/json'
                      }
                    }
                  )
                    .then((res) => {
                      if (res.ok) {
                        return res.json();
                      } else {
                        return res.json().then(() => {
                          const errorMessage = 'Authentication Failed';
                          throw new Error(errorMessage);
                        });
                      }
                    })
                    .then((data) => {
                      authCtx.login(data.idToken);
                      history.push('/timeline');
                    })
                    .catch((err) => {
                      alert(err.message);
                    });
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h3">Login</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        label="E-Mail Address"
                        type="email"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name="password"
                        label="Password"
                        type="password"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button>Login</Button>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginForm;
