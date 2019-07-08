import express from 'express';
import bodyParser from 'body-parser';

// router
import user from './route/user';
import flower from './route/flower';
import upload from './route/upload';
import image from './route/image';

const app = express();
const port = process.env.PORT;
app.set('port', port || 5000);

app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/chatbot/upload', upload);
app.use('/chatbot/image', image);
app.use('/chatbot/flower', flower);
app.use('/chatbot/user', user);

app.listen(app.get('port'), () => {
  console.log('Node server is running on port ' + app.get('port'));
});
