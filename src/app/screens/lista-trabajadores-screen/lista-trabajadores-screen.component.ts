import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-lista-trabajadores-screen',
  templateUrl: './lista-trabajadores-screen.component.html',
  styleUrls: ['./lista-trabajadores-screen.component.scss']
})
export class ListaTrabajadoresScreenComponent implements OnInit {

  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_trabajadores: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['clave_trabajador', 'nombre', 'email', 'edad','rfc', 'telefono', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_trabajadores as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(
    public facadeService: FacadeService,
    private trabajadoresService:TrabajadoresService,
    private router: Router,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if(this.token == ""){
      this.router.navigate([""]);
    }

    this.obtenerTrabajadores();
    //Para paginador
    this.initPaginator();
  }



  public goEditar(idUser:number){
    this.router.navigate(["registro-usuarios/trabajador/"+idUser]);

  }

  public delete(idUser: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'trabajador'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Trabajador eliminado");
        //Recargar página
        alert("Trabajador eliminado Corrcetamente");
        window.location.reload();
      }else{
        alert("Trabajador no eliminado ");
        console.log("No se eliminó el trabajador");
      }
    });
  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
  }


  //Obtener alumnos
  public obtenerTrabajadores(){
    this.trabajadoresService.obtenerListaTrabajadores().subscribe(
      (response)=>{
        this.lista_trabajadores = response;
        console.log("Lista users: ", this.lista_trabajadores);
        if(this.lista_trabajadores.length > 0){
          //Agregar datos del nombre e email
          this.lista_trabajadores.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_trabajadores as DatosUsuario[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de usuarios");
      }
    );
  }



}

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  clave_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  rfc: string,
  edad: number,
  telefono: string,
}
