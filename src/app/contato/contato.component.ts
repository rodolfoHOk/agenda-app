import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];

  constructor(
    private service: ContatoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required ],
      email: ['', [Validators.email, Validators.required ]]
    });
   }

  ngOnInit(): void {
    this.formulario.reset();   
    
    this.listarContatos();
  }

  listarContatos(){
    this.service
            .list()
            .subscribe( response => {
              this.contatos = response;
            });
  }

  favoritar( contato : Contato ) {
    this.service
            .favourite ( contato )
            .subscribe( response => {
              contato.favorito = !contato.favorito;
            });
  }
  
  submit(){
    const nome = this.formulario.value.nome;
    const email = this.formulario.value.email;
    const contato : Contato = new Contato(nome, email);
    this.service
            .save(contato)
            .subscribe(
              response => {
                // this.contatos.push(response);
                let novaLista : Contato[] = [...this.contatos, response];
                this.contatos = novaLista;
              },
            );
  }

  uploadFoto( event: any, contato: Contato ){
    const files = event.target.files;
    if ( files ) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service
              .upload(contato, formData)
              .subscribe(response => this.listarContatos());
    }
  }

  visualizarContato ( contato: Contato ) {
    this.dialog.open ( ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    });
  }

  /* Somente para teste
  teste(){
    
    /* Teste de formulario - Ok
    const nomeVazio = this.formulario.controls.nome.errors?.required;
    const emailInvalido = this.formulario.controls.email.errors?.email;
    console.log(nomeVazio);
    console.log(emailInvalido);
    console.log(this.formulario.value);

    /* Teste de integração - Ok
    const c : Contato = new Contato();
    c.nome = 'Jose';
    c.email = 'jose@email.com';
    c.favorito = false;
    this.service
            .save(c)
            .subscribe(
              response => {
                console.log(response)
              },
            );
  } */

}
