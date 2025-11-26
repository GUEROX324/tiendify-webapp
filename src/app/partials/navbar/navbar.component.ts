import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
declare var $:any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() tipo: string = "";
  @Input() rol:string ="";


  public token:string = "";
  public editar: boolean = false;


  constructor(
    private router: Router,
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,

  ){}

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    console.log("Rol user: ", this.rol);
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
    }

  }

  public goRegistro(){
    this.router.navigate(["registro-usuarios"]);
  }

  public clickNavLink(link: string){
  this.router.navigateByUrl('/' + link);
}


  public logout(){
    this.facadeService.logout().subscribe(
      (response)=>{
        console.log("Entró");
        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      }, (error)=>{
        console.error(error);
      }
    );
  }

  public activarLink(link: string){
    if(link == "trabajadores"){
      $("#principal").removeClass("active");
      $("#maestro").removeClass("active");
      $("#alumno").addClass("active");

    }else if(link == "master"){
      $("#principal").removeClass("active");
      $("#trabajador").removeClass("active");
      $("#maestro").addClass("active");

    }else if(link == "home"){
      $("#trabajadores").removeClass("active");
      $("#master").removeClass("active");
      $("#principal").addClass("active");
    }
  }

}
