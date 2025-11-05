import { Size } from "src/app/interfaces/size.interface";

export interface Color {
    id: number, //
    name: string,
    product_id: number,
    sizes: Size[]
  }


//   <img card-image class="card-img-top" [src]="[color.image.url_thumbnail]" alt="Sample Image">
    
//   <div class="card-body">
  
//       <h5 card-title class="card-title">{{ (color.price[0] != null ? color.price[0].value : 0) | pen }}</h5>

//       <a href="https://api.whatsapp.com/send?phone=51945101774" target="_blank" rel="noopener noreferrer"
//           class="btn btn-success"><i class="fa-brands fa-whatsapp"></i></a>
//   </div>