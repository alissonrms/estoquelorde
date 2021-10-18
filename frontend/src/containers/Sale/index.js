import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import Colors from "../../constants/Colors";

import { Card } from "../../components/Card";

import api from "../../services/api";

import {
  Container,
  ProductContainer,
  ProductName,
  QuantityContainer,
  QuantityControlButton,
  QuantityInput,
} from "./styles";

import Navbar from "../../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

import { PageTitle } from "../Stock/newProduct/styles";

function Sale() {

  useEffect(() => {
    defineProducts([
      {
        name: 'Sal Bovino'
      },
      {
        name: 'Sal Mineral'
      },
    ])
    // api.get("product", {}).then((response) => {
    //   defineProducts(response.data);
    // });
  }, []);

  function defineProducts(data) {
    for (let i in data) {
      data[i].amount = "0";
    }
    console.log(data);
  }

  // const preventPasteNegative = (e) => {
  //   const clipboardData = e.clipboardData || window.clipboardData;
  //   const pastedData = parseFloat(clipboardData.getData("text"));

  //   if (pastedData < 0) {
  //     e.preventDefault();
  //   }
  // };

  // const preventMinus = (e) => {
  //   if (e.code === "Minus") {
  //     e.preventDefault();
  //   }
  // };

  // function setProductAmount(index, value) {
  //   let items = products;
  //   items[index].amount = value;
  //   items[index + 1].amount = value;
  //   setProducts(items);
  //   console.log(products);
  // }

  // return (
  //   <>
  //     <Container>
  //       <PageTitle>Cadastrar Venda</PageTitle>

  //       {products.map((product, index) => (
  //         <Card key={index}>
  //           <ProductContainer>
  //             <ProductName>{product.name}</ProductName>

  //             <QuantityContainer>
  //               <QuantityControlButton left>
  //                 <FontAwesomeIcon
  //                   icon={faMinusSquare}
  //                   size="2x"
  //                   color={Colors.red}
  //                 />
  //               </QuantityControlButton>

  //               <QuantityInput
  //                 key={"@inputKey:" + index}
  //                 min="0"
  //                 value={products[index].amount}
  //                 onPaste={preventPasteNegative}
  //                 onKeyPress={preventMinus}
  //                 onChange={(event) =>
  //                   setProductAmount(index, event.target.value)
  //                 }
  //               ></QuantityInput>

  //               <QuantityControlButton right>
  //                 <FontAwesomeIcon
  //                   icon={faPlusSquare}
  //                   size="2x"
  //                   color={Colors.green}
  //                 />
  //               </QuantityControlButton>
  //             </QuantityContainer>
  //           </ProductContainer>
  //         </Card>
  //       ))}
  //     </Container>

  //     <Navbar />
  //   </>
  // );
  const { register, control, handleSubmit, reset, trigger, setError } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute 
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test"
  });
  
  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input {...register(`test.${index}.firstName`)} />
            <Controller
              render={({ field }) => <input {...field} />}
              name={`test.${index}.lastName`}
              control={control}
            />
            <button type="button" onClick={() => remove(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => append({ firstName: "bill", lastName: "luo" })}
      >
        append
      </button>
      <input type="submit" />
    </form>
  );
}

export default Sale;
