import { TrabajadoresService } from './../../services/trabajadores.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
declare var $:any;

@Component({
  selector: 'app-registro-trabajadores',
  templateUrl: './registro-trabajadores.component.html',
  styleUrls: ['./registro-trabajadores.component.scss']
})
export class RegistroTrabajadoresComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public trabajador:any = {};
  public errors:any={};
  public editar:boolean = false;
  public token:string = "";
  public idUser: Number = 0;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private trabajadoresService: TrabajadoresService,
    private location : Location,
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {
     //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.trabajador = this.datos_user;
    }else{
      this.trabajador = this.trabajadoresService.esquemaTrabajador();
      this.trabajador.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Trabajador: ", this.trabajador);
  }

  showPassword(){
     if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar(){
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){
    this.location.back();

  }

  public registrar(){
    //Validar
    this.errors = [];

    this.errors = this.trabajadoresService.validarTrabajador(this.trabajador, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }

    //Validar la contraseña
    if(this.trabajador.password == this.trabajador.confirmar_password){
      //Entra a registrar
      this.trabajadoresService.registrarTrabajador(this.trabajador).subscribe(
        (response)=>{
          //Aquí va la ejecución del servicio si todo es correcto
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          if(this.token != ""){
            this.router.navigate(["home"]);
          }else{
            this.router.navigate(["/"]);
          }
        }, (error)=>{
          //Aquí se ejecuta el error
          alert("No se pudo registrar usuario");
        }
      );
    }else{
      alert("Las contraseñas no coinciden");
      this.trabajador.password="";
      this.trabajador.confirmar_password="";
    }
  }

  public actualizar(){}

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}
