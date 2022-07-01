public with sharing class OrderController {

    @AuraEnabled
    public static Boolean insertNewOrder(Map<String, Object> newOrder){
        try {
            Order__c order = new Order__c();

            order.Name = (String)newOrder.get('name');
            order.Account__c = (Id)newOrder.get('accountId');
            order.TotalPrice__c = (Decimal)newOrder.get('totalPrice');
            order.PaymentType__c = String.isNotBlank((String)newOrder.get('currentPaymentType')) 
                                ? (String)newOrder.get('currentPaymentType') 
                                : '';
            order.PaymentPeriod__c = String.isNotBlank((String)newOrder.get('currentPaymentPeriod')) 
                                ? (String)newOrder.get('currentPaymentPeriod') 
                                : '';
                        
            insert order;
            
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getPaymentTypeValues(){
        List<String> paymentTypetValues= new List<String>();
        Schema.DescribeFieldResult fieldResult = Order__c.PaymentType__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            paymentTypetValues.add(pickListVal.getLabel());
        }     
        return paymentTypetValues;
    }


    @AuraEnabled(cacheable=true)
    public static List<String> getPaymentPeriodValues(){
        List<String> paymentPeriodValues= new List<String>();
        Schema.DescribeFieldResult fieldResult = Order__c.PaymentPeriod__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            paymentPeriodValues.add(pickListVal.getLabel());
        }     
        return paymentPeriodValues;
    }

}