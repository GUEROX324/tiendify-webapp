import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { FacadeService } from 'src/app/services/facade.service';
import { ActivatedRoute,Router } from '@angular/router';
import { AdministradoresService } from '../../services/administradores.service';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import { MasterService } from 'src/app/services/master.service';




@Component({
  selector: 'app-registro-screen',
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent implements OnInit {

  public tipo:string = "registro-usuarios";
  //JSON para los usuarios (admin, trabajadores, master)
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};

  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isTrabajador:boolean = false;
  public isMaster:boolean = false;
  public editar: boolean = false;
  public registrar: boolean = false;
  public tipo_user:string = "";

  //Info del usuario
  public idUser: Number = 0;
  public rol: string = "";

  constructor(
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router,
    private administradoresService: AdministradoresService,
    private trabajadoresService: TrabajadoresService,
    private masterService: MasterService
  ){}


  ngOnInit(): void {
        //Obtener de la URL el rol para saber cual editar
    if(this.activatedRoute.snapshot.params['rol'] != undefined){
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol detect: ", this.rol);
    }
    //El if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista obtiene el usuario por su ID
      this.obtenerUserByID();
    }
  }

  //Función para obtener un solo usuario por su ID
  public obtenerUserByID(){
    if(this.rol == "administrador"){
      this.administradoresService.getAdminByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isAdmin = true;
          //this.user.fecha_nacimiento = response.fecha_nacimiento.split("T")[0];
          console.log("Datos user: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }else if(this.rol == "trabajador"){
      this.trabajadoresService.getTrabajadorByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isTrabajador = true;
          console.log("Datos trabajador: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }else if(this.rol == "master"){
      this.masterService.getMasterByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isMaster = true;
          console.log("Datos master: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }
  }


  public radioChange(event: MatRadioChange){
    if(event.value == "administrador"){
      this.isAdmin = true;
      this.tipo_user = "administrador"
      this.isTrabajador = false;
      this.isMaster = false;
    }else if (event.value == "trabajador"){
      this.isAdmin = false;
      this.isTrabajador = true;
      this.tipo_user = "trabajador"
      this.isMaster = false;
    }else if (event.value == "master"){
      this.isAdmin = false;
      this.isTrabajador = false;
      this.isMaster = true;
      this.tipo_user = "master"
    }
  }



}
