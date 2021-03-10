require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('./jwt');
const pm2 = require('pm2');
const exec = require("child_process").exec;

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());

const checkAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded) => {
      req.decoded = decoded;
      next();
    }, err => {
      return res.send({
        ok: false,
        error: 'UNAUTHORIZED',
      });
    });
};

const user = {
  id: 1,
  username: 'admins',
  email: 'soft.phingo@gmail.com',
  name: 'Banjong Kittisawangwong'
};

router.get('/', (req, res) => {
  res.send({ ok: true, message: 'wellcome to api by. phingosoft.com' });
});

router.get('/me', checkAuth, (req, res) => {
  res.send({ ok: true, data: { user } });
});

router.get('/list', checkAuth, (req, res) => {
  const pm2List = new Promise(async (resolve, reject) => {
    await pm2.connect(async function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      await pm2.list(async (err, list) => {
        //console.log(err, list)
        if (err)
          reject(err);
        else
          await resolve(list);
      });
    });
  });

  pm2List.then((result) => {
    res.send({ ok: true, rows: result});
  }).catch((error) => {
    res.send({ ok: false, error});
  }).finally(() => {
    res.send({ ok: true });
  });
});

router.get('/log-error/:pid/:appName', checkAuth, (req, res) => {
  const { pid, appName } = req.params;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }
  try {
    const path = `/root/.pm2/logs/${appName}-error-${pid}.log`;
    exec(`cat ${path}`, (error, stdout, stderr) => {
      if (error) {
        res.send({ ok: false, error: stderr});
        return;
      } else {
        res.send({ ok: true, logs: stdout});
        return;
      }
    });
  } catch (error) {
    res.send({ ok: false, error});
  }
});

router.get('/log-out/:pid/:appName', checkAuth, (req, res) => {
  const { pid, appName } = req.params;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }
  try {
    const path = `/root/.pm2/logs/${appName}-out-${pid}.log`;
    exec(`cat ${path}`, (error, stdout, stderr) => {
      if (error) {
        res.send({ ok: false, error: stderr});
        return;
      } else {
        res.send({ ok: true, logs: stdout});
        return;
      }
    });
  } catch (error) {
    res.send({ ok: false, error});
  }
});

router.post('/start', checkAuth, (req, res) => {
  const { pid } = req.body;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }

  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    const pm2List = new Promise(async (resolve, reject) => {
      await pm2.reload(pid, async (err, proc) => {
        if (err)
          reject(err);
        else
          resolve(proc);
      })
    });

    pm2List.finally(() => {
      res.send({ ok: true});
    });
  });
});

router.post('/restart', checkAuth, (req, res) => {
  const { pid } = req.body;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }

  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    const pm2List = new Promise(async (resolve, reject) => {
      await pm2.restart(pid, async (err, proc) => {
        if (err)
          reject(err);
        else
          resolve(proc);
      })
    });

    pm2List.finally(() => {
      res.send({ ok: true});
    });
  });
});

router.post('/stop', checkAuth, (req, res) => {
  const { pid } = req.body;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }

  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    const pm2List = new Promise(async (resolve, reject) => {
      await pm2.stop(pid, async (err, proc) => {
        if (err)
          reject(err);
        else
          resolve(proc);
      })
    });

    pm2List.finally(() => {
      res.send({ ok: true});
    });
  });
});

router.post('/flush', checkAuth, (req, res) => {
  const { pid } = req.body;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }

  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    const pm2List = new Promise(async (resolve, reject) => {
      await pm2.flush(pid, async (err, proc) => {
        if (err)
          reject(err);
        else
          resolve(proc);
      })
    });

    pm2List.finally(() => {
      res.send({ ok: true});
    });
  });
});

router.delete('/delete/:pid', checkAuth, (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    res.send({ ok: true, error: 'not found pid?'});
    return ;
  }

  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    const pm2List = new Promise(async (resolve, reject) => {
      await pm2.del(pid, async (err, proc) => {
        if (err)
          reject(err);
        else
          resolve(proc);
      })
    });

    pm2List.finally(() => {
      res.send({ ok: true});
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username: username });
    res.send({ ok: true, token: token });
  } else {
    res.send({ ok: false, error: 'Login fiale!'});
  }
});


app.use(router);
module.exports = {
  path: '/api',
  handler: app
};
