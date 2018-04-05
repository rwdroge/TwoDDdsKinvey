const sdk = require("kinvey-flex-sdk");

sdk.service(function(err, flex) {
    const data = flex.data;   // gets the FlexData object from the service
    
    function getSingleCustomer(request, complete, modules) {
        
        let entityId = request.entityId;
        const Rollbase = modules.dataStore().collection("RBCustomers");
        const SFDC = modules.dataStore().collection("SFCustomers");
        const query = new modules.Query();
        const mnquery = new modules.Query();
        let array = {};
        
        Rollbase.findById(entityId, function(error, result2) {
            if (error) {
                return complete(error).runtimeError().done();
              }
            SFDC.findById(result2.SALESFORCE_ID, function(error, result) {
                array = Object.assign(result2, result);
                return complete().setBody(array).ok().done();
            });
           
        });
    }

    function getAllCustomers(request, complete, modules) {
        
        const Rollbase = modules.dataStore().collection("RBCustomers");
        const SFDC = modules.dataStore().collection("SFCustomers");
        const query = new modules.Query();
        let jsobject = {};
        let array = [];
        
        Rollbase.find(query, function(error, result2) {
            if (error) {
                return complete(error).runtimeError().done();
            }
            result2.forEach(function(i, idx, blaat) {
                if (i.SALESFORCE_ID) {
                    SFDC.findById(i.SALESFORCE_ID, function(error, result) {
                        jsobject = Object.assign(i,result);
                        array.push(jsobject);
                        if (idx === blaat.length -1) {
                            return complete().setBody(array).ok().done();
                        }
                    
                    });
                }
            });
        });
    }

    const Customers = data.serviceObject('Customer');
    // wire up the event that we want to process
    Customers.onGetById(getSingleCustomer);
    Customers.onGetAll(getAllCustomers);
});