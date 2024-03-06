import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL = environment.serverUrl;
  constructor(private http: HttpClient) { }

  get(url) {
    // console.log(this.baseURL);
    // console.log(url);
    return this.http.get(this.baseURL + url);
    // https://cloud.neolysi.com/madanapi/api/Consigner
  }

  post(url, req) {
    return this.http.post(this.baseURL + url, req);
    // https://cloud.neolysi.com/madanapi/api/Consigner
  }

  put(url, req) {
    return this.http.put(this.baseURL + url, req);
  }

  delete(url) {
    return this.http.delete(this.baseURL + url);
  }

  formUrl(...urls): string {
    return urls.join('/');
  }
  getReferceListCiy(name) {
    return this.http.get(this.baseURL+'ReferenceList/GetRLByRLDesc/?name=' + name);
  }
  getCities() {
    return this.get(this.formUrl('ReferenceList/GetRLByRLDesc/?name='));
  }
  getCityBySate(name) {
    return this.http.get(this.baseURL+'ReferenceList/GetRLByRLDesclike/?name=' + name);
  }

  getStates() {
    return this.get(this.formUrl('ReferenceList/GetRLByRName/?name=state'));
  }

  getCountries() {
    return this.get(this.formUrl('ReferenceList/GetRLByRName/?name=country'));
  }
  getGstData(gstNo) {
    console.log('https://appyflow.in/api/verifyGST/?gstNo=' + gstNo + '&key_secret=mqDMTdJpfIU6qpmfyQWp5qMOxbm2');

    return this.http.get('https://appyflow.in/api/verifyGST/?gstNo=' + gstNo + '&key_secret=mqDMTdJpfIU6qpmfyQWp5qMOxbm2');
  }
}
