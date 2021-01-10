const express = require('express');
const cors = require('cors');
const compression = require('compression');
const logger = require('morgan');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(compression());
app.use(logger('dev'));

app.get('/', (req, res) => {
   try {
      fs.readFile(__dirname + '/data.json', (err, data) => {
         if (err) {
            console.error(err);
            return res.status(500).json({
               err: { ...err, msg: err.message },
            });
         } else {
            const obj = JSON.parse(data).AJAY;
            return res.status(200).json({
               countries: obj
                  .map((cnt) => {
                     return { countryName: cnt.countryName, cId: cnt.cId };
                  })
                  .sort((cn1, cn2) =>
                     cn1.countryName.toLowerCase() < cn2.countryName.toLowerCase() ? -1 : 1
                  ),
            });
         }
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({
         err: { ...err, msg: err.message },
      });
   }
});

app.get('/state/:cId', (req, res) => {
   try {
      fs.readFile(__dirname + '/data.json', (err, data) => {
         if (err) {
            console.error(err);
            return res.status(500).json({
               err: { ...err, msg: err.message },
            });
         } else {
            const obj = JSON.parse(data).AJAY.filter(
               (cnt) => cnt.cId === parseInt(req.params.cId)
            )[0];
            const obj2 = obj.states
               .map((st) => {
                  return {
                     stateName: st.stateName,
                     sId: st.sId,
                  };
               })
               .sort((cn1, cn2) =>
                  cn1.stateName.toLowerCase() < cn2.stateName.toLowerCase() ? -1 : 1
               );
            return res.status(200).json({
               states: obj2,
            });
         }
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({
         err: { ...err, msg: err.message },
      });
   }
});

app.get('/city/:sId', (req, res) => {
   try {
      fs.readFile(__dirname + '/data.json', (err, data) => {
         if (err) {
            console.error(err);
            return res.status(500).json({
               err: { ...err, msg: err.message },
            });
         } else {
            const obj = JSON.parse(data)
               .AJAY.map((cnt) => {
                  return cnt.states.map((st) =>
                     st.sId === parseInt(req.params.sId) ? st.cities : null
                  );
               })
               .flat(2)
               .filter((itm) => itm !== null)
               .sort((cn1, cn2) =>
                  cn1.cityName.toLowerCase() < cn2.cityName.toLowerCase() ? -1 : 1
               );
            return res.status(200).json({
               cities: obj,
            });
         }
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({
         err: { ...err, msg: err.message },
      });
   }
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
   console.log(`Your App is Running on port ${app.get('port')}`);
});
