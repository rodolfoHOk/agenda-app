import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from './contato/contato';
import { environment } from '../environments/environment';
import { PaginaContato } from './contato/paginaContato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiBaseUrl + '/api/contatos';

  constructor(
    private http: HttpClient
  ) { }

  save ( contato: Contato ) : Observable<Contato> {
    return this.http.post<Contato>(this.url, contato);
  }

  list ( page: number, size: number ) : Observable<PaginaContato> {
    const params = new HttpParams()
                          .set('page', page.toString())
                          .set('size', size.toString())

    return this.http.get<any>(`${this.url}?${params.toString()}`);
  }

  favourite ( contato: Contato ) : Observable<any> {
    return this.http.patch<any>(`${this.url}/${contato.id}/favorito`, contato.favorito);
  }

  upload ( contato: Contato, formData : FormData ) : Observable<any> {
    return this.http.put(`${this.url}/${contato.id}/foto`,
                                      formData, { responseType: 'blob'});
  }
}
