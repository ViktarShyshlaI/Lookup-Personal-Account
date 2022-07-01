public with sharing class LookupAccount {

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, string myObject) {
        List<sObject> lookUpList = new List<sObject>();
        Boolean isPersonAccount = isPersonAccountActive();
        if (isPersonAccount) {
            String query = null;
            if (searchTerm == null || searchTerm == '') {
                query = 'Select Id, FirstName, LastName from ' + myObject + ' Where isPersonAccount = TRUE AND LastViewedDate != NULL ORDER BY LastViewedDate DESC LIMIT  5';
            }
            else {
                query = 'Select Id, FirstName, LastName from ' + myObject +
                        ' Where isPersonAccount = TRUE AND (FirstName Like  \'%' + searchTerm + '%\'' + 
                        ' OR LastName Like  \'%' + searchTerm + '%\') LIMIT  5';
            }
            lookUpList = Database.query(query);
        }

        return lookUpList;
    }


    private static Boolean isPersonAccountActive() {
        return Schema.sObjectType.Account.fields.getMap().containsKey('isPersonAccount');
    }

}