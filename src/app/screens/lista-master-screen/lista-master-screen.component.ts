import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-lista-master-screen',
  templateUrl: './lista-master-screen.component.html',
  styleUrls: ['./lista-master-screen.component.scss']
})
export class ListaMasterScreenComponent implements OnInit {

  public name_user:string ="";
  public lista_master:any[]= [];

  constructor(
    private facadeService: FacadeService,
    private masterService: MasterService ,
    private router: Router,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    //Lista de admins
    this.obtenerMaster();
  }

  //Obtener lista de usuarios
  public obtenerMaster(){
    this.masterService.obtenerListaMaster().subscribe(
      (response)=>{
        this.lista_master = response;
        console.log("Lista users: ", this.lista_master);
      }, (error)=>{
        alert("No se pudo obtener al master");
      }
    );
  }

  //Funcion para editar
  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/master/"+idUser]);
  }

  public delete(idUser: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'master'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Master eliminado");
        //Recargar página
        alert("Master eliminado Corrcetamente");
        window.location.reload();
      }else{
        alert("Master no eliminado ");
        console.log("No se eliminó el master");
      }
    });

  }
}


