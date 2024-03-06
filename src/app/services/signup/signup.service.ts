import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private api: ApiService) { }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  baseURL = environment.serverUrl;
  getReferceListDatas(name) {
    return this.api.get('ReferenceList/GetRLByRName/?name=' + name);
  }

  getGstDetails(gstNo) {
    // return null;
    return this.api.getGstData(gstNo);
  }

  registerDetails(data) {
    return this.api.post('Customer', data);
  }

  addUser(userReq) {
    return this.api.post('User/', userReq);
  }

  getLorryOwnerRole() {
    return this.api.get('role/GetRolebyName/?name=LorryOwner');
  }
  updateLorryLocation(vehicleId, req) {
    return this.api.put(`vehicle/PutLiveLocation/?id=${vehicleId}`, req);
  }

  getCities() {
    return this.api.get('ReferenceList/GetRLByRName/?name=city');
  }
  getReferceListCiy(name) {
    return this.api.get('ReferenceList/GetRLByRLDesc/?name=' + name);
  }

  getStates() {
    return this.api.get('ReferenceList/GetRLByRName/?name=state');
  }

  getCountries() {
    return this.api.get('ReferenceList/GetRLByRName/?name=country');
  }
  getRole() {
    return this.api.get('role/GetRolebyName/?name=Customer');
  }
  getCityBySate(name) {
    return this.api.get('ReferenceList/GetRLByRLDesclike/?name=' + name);
  }
}
