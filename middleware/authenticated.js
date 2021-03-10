export default function({ $auth, redirect }) {
  $auth.onError((error, name, endpoint) => {
    console.log(name, error);
  });

  $auth.onRedirect((to, from) => {
    console.log('to ', to);

  });

  console.log('auth ', $auth.loggedIn);
  if (!$auth.loggedIn) {
    //redirect('/login');
    return;
  }
}
