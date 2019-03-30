import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import customers from '../../../assets/customer.json';
import contacts from '../../../assets/contacts.json';
import campaigns from '../../../assets/campaign.json';
import {Campaign, Contact, Customer} from '@app/sales/shared/models';
import {HttpClient} from '@angular/common/http';
import {ContactToDisplay} from '@app/sales/components/contact/contact.component';
import {resolve} from 'q';
import {__await} from 'tslib';


PouchDB.plugin(PouchFind);

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {

  public db: any = null;

  public customers: Customer[] = customers;
  public contacts: Contact[] = contacts;
  public campaigns: Campaign[] = campaigns;

  public gwtToken: any;

  constructor(private httpClient: HttpClient) {
    this.init();
  }

  private init() {
  }

  public loadDB(): Promise<any> {
    console.log(' ################## DB Service #######################');
    // PouchDB doesn't overwrite data - it creates revisions (like Git).
    // For the purposes of this app, however, we don't need those revisions
    // to stay around, taking up storage space. By enabling auto_compaction,
    // PouchDB will only keep the most current revision in storage.


    console.log('***** Setting-up the DB ******');
    return new Promise((resolve, reject) => {

      new PouchDB('mydb').destroy().then(() => {
        console.log('DB destroyed');
        console.log(this.campaigns);
        if (this.db == null) {
          this.db = new PouchDB('mydb', {auto_compaction: true});
        }
        this.db.bulkDocs(this.campaigns).then((campaignDb) => {
          console.log('Initial campaign data loaded.');
          this.db.bulkDocs(this.customers).then((customerDb) => {
            console.log('Initial customers data loaded.');
            this.db.bulkDocs(this.contacts).then((results) => {
              console.log('Initial contacts data loaded.');

              resolve();
            });
          });
        });
      });
      console.log('***** DB setup done ******');
    });


  }


  public isDbAvailable() {
    if (this.db == null) {
      return false;
    }
    return true;
  }

  public destroyDatabase() {
    return new PouchDB('mydb').destroy().then(() => {
      this.db = null;
      return 'Database cleared!';
    }).catch((err) => {
      return err;
    });
  }

  public getCustomers() {
    return this.db.allDocs({include_docs: true}).then((results) => {
      const allCustomers = results.rows.map(element => element.doc);
      return allCustomers;
    });
  }

  public getAllCustomers() {
    return this.db.createIndex({
      index: {fields: ['entity']}
    }).then(() => {
      return this.db.find({
        selector: {entity: 'customer'}
      });
    });
  }

  public getCustomer(id: any) {
    return this.db.get(id).then((doc) => {
      console.log(doc);
      return doc;
    });
  }

  public removeCustomer(doc: any) {
    return this.deleteContactsForCustomer(doc._id).then((deleteResult) => {
      this.db.remove(doc).then((result) => {
        return result;
      }).catch((err) => {
        return err;
      });
    });
  }


  // =========== Contacts DB Operations ==========

  public getContacts() {
    return this.db.createIndex({
      index: {fields: ['entity']}
    }).then(() => {
      return this.db.find({
        selector: {entity: 'contact'}
      });
    });
  }

  public getContact(id: any) {
    return this.db.get(id).then((doc) => {
      return doc;
    });
  }

  public removeContact(doc: any) {
    return this.db.remove(doc).then(() => {
      return 'Contact record deleted!';
    }).catch((err) => {
      return err;
    });
  }

  public getContactsForCustomer(customerId: any) {

    if (this.db != null) {

      return this.db.createIndex({

        index: {fields: ['entity', 'customer_id']}

      }).then(() => {

        return this.db.find({

          selector: {entity: 'contact', customer_id: customerId}

        }).then( (docsFound) => {

          const allContacts: ContactToDisplay[] = [];
          return new Promise<ContactToDisplay[]>(resolveMe => {

            docsFound.docs.forEach(doc => {
              const oneContact = {} as ContactToDisplay;
              oneContact.conversation = doc.conversation;
              oneContact.campaign_name = doc.campaign_name;
              oneContact.method = doc.method;
              oneContact.created_at = doc.created_at;
              oneContact.customer_id = customerId;

              this.getTrustTagForAContact(doc._id).then((trustTagDoc) => {
                // get trusttag for this contact from trusttag table
                // we only save latest trusttag record.
                if (trustTagDoc != null && trustTagDoc.docs.length > 0) {
                  oneContact.trusttag = trustTagDoc.docs[0].trusttag;
                  // now find out which campaign this contact belongs to. Search campaign id in Campaign table and set here.
                  allContacts.push(oneContact);
                }

              });

            });
            this.delay(500).then(any => {
              resolveMe(allContacts);
            });
          });
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async delay(ms: number) {
    await new Promise(resolveMe => setTimeout(() => resolveMe(), ms));
  }


  public deleteContactsForCustomer(customerId: any) {
    return this.db.createIndex({
      index: {fields: ['entity', 'customer_id']}
    }).then(() => {
      // Returning promise is important.
      return this.db.find({
        selector: {customer_id: customerId, entity: 'contact'}
      }).then((docFound) => {
        docFound.docs.forEach(item => {
          this.db.remove(item).then(() => {
            return 'Customer and associated contacts deleted.';
          }).catch((err) => {
            console.log(err);
          });
        });
      });
    });
  }

  // =====================

  // ======== Campaign DB Operations ===========

  public getCampaigns() {
    return this.db.createIndex({
      index: {fields: ['entity']}
    }).then(() => {
      return this.db.find({
        selector: {entity: 'campaign'}
      });
    });
  }

  public getCampaign(id: any) {
    return this.db.get(id).then((doc) => {
      return doc;
    });
  }

  public removeCampaign(doc: any) {
    return this.db.remove(doc).then(() => {
      return 'Campaign record deleted!';
    }).catch((err) => {
      return err;
    });
  }

  public saveDoc(doc: any) {
    return this.db.put(doc).then((response => {
      return response;
    }));
  }

  public seedCustomerData() {
    if (this.db == null) {
      this.db = new PouchDB('mydb', {auto_compaction: true});
    }
    return this.db.bulkDocs(this.customers).then((results) => {
      return 'Customer data loaded!';
    }).catch((err) => {
      return err;
    });
  }

  public seedCampaignData() {
    if (this.db == null) {
      this.db = new PouchDB('mydb', {auto_compaction: true});
    }
    return this.db.bulkDocs(this.customers).then((results) => {
      return 'Campaign data loaded!';
    }).catch((err) => {
      return err;
    });
  }

  // ========== TrustTag

  public getTrustTagForAContact(contactId: any) {

    if (this.db != null) {
      return this.db.createIndex({
        index: {fields: ['entity', 'contact_id']}
      }).then((index) => {
        return this.db.find({
          selector: {contact_id: contactId, entity: 'trusttag'},
          fields: ['trusttag']
        });
      }).catch((error) => {
        console.log(error);
      });
    }
    return null;

  }

  public deleteTrustTags(customerId: any) {
    return this.db.createIndex({
      index: {fields: ['entity', 'customer_id']}
    }).then(() => {
      // Returning promise is important.
      return this.db.find({
        selector: {customer_id: customerId, entity: 'trusttag'}
      }).then((docFound) => {
        docFound.docs.forEach(item => {
          this.db.remove(item).then((deleted) => {
            console.log('deleting .......');
          }).catch((err) => {
            console.log(err);
          });
        });
      });
    });
  }

}
