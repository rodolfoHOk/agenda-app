import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContatoService } from '../contato.service';
import { Contato } from './contato';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];
  
  totalElementos: number = 0;
  pagina: number = 0;
  tamanho: number = 5;
  pageSizeOptions: number[] = [5, 10];

  constructor(
    private service: ContatoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required ],
      email: ['', [Validators.email, Validators.required ]]
    });
   }

  ngOnInit(): void {
    this.formulario.reset();   
    
    this.listarContatos(this.pagina, this.tamanho);
  }

  listarContatos ( pagina: number, tamanho: number ) {
    this.service
            .list(pagina, tamanho)
            .subscribe( response => {
              this.contatos = response.content;
              this.totalElementos = response.totalElements;
              this.pagina = response.number;
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
                // let novaLista : Contato[] = [...this.contatos, response]; //como paginamos
                // this.contatos = novaLista; // como paginamos
                this.listarContatos(this.pagina, this.tamanho);
                this.snackBar.open('Contato adicionado!', 'Sucesso', {
                  duration: 2000
                });
                this.formulario.reset();
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
              .subscribe(response => this.listarContatos(this.pagina, this.tamanho));
    }
  }

  visualizarContato ( contato: Contato ) {
    this.dialog.open ( ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    });
  }

  paginar ( event: PageEvent ) {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.listarContatos(this.pagina, this.tamanho);
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
