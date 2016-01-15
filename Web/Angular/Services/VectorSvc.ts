interface IVectorSvc {
    connect();
}

class VectorSvc implements IVectorSvc {

    connect() {
  
    }
}

app.service('vectorSvc', () => { return new VectorSvc(); }); 