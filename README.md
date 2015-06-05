# washington-ferries-feed

Aggregate data from the [Washington realtime ferry feed](http://www.wsdot.com/ferries/vesselwatch/Vessels.ashx) ([more info](http://www.wsdot.com/ferries/)).

##install

```
git clone git@github.com:morganherlocker/washington-ferries-feed.git
cd washington-ferries-feed
npm install
```

##run

```
node index.js
```

This will create hourly geojson files with aggregated route data in `./out`.
