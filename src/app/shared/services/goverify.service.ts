import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class GoverifyService {

  gwtToken: any;

  constructor(private httpClient: HttpClient) {
  }

  public createTrustTag(campaignId: any, knownFact: any) {
    const trustTagEndPoint = `${environment.baseUrl}/users/organisation/campaigns/${campaignId}/trusttags`;
    return this.httpClient.post<any>(trustTagEndPoint, {
      'knownfact': knownFact
    });
  }

  public getOrganisation() {
    const getOrganisationEndPoint = `${environment.baseUrl}/users/organisation`;
    return this.httpClient.get<any>(getOrganisationEndPoint);
  }

  public fetchToken(): Promise<any> {
    console.log(' ################## Fetch Token #######################');
    return new Promise((resolve, reject) => {
      const loginEndPoint = `${environment.baseUrl}/users/login`;
      this.httpClient.post<any>(loginEndPoint, {
        'username': environment.apiUser,
        'password': environment.apiPassword,
      }).subscribe(data => {
        this.gwtToken = data.token;
        resolve();
      });
    });
  }
}
