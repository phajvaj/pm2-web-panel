export default function ({ $auth, store, redirect }) {
  const login = store.state.user || false;
  if (login) {
    return redirect('/');
  }

  $auth.onRedirect((to, from) => {
    console.log('to ', to);

    if ($auth.loggedIn) {
      redirect('/');
    }
  });
}
