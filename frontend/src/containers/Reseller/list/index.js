import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

import api from "../../../services/api";

import {
  ActionButtonsContainer,
  Container,
  IconButton,
  NewButton,
} from "./styles";
import { Card, HeaderText, ItemsContainer } from "../../../components/Card";
import Navbar from "../../../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function ResellerList() {
  const history = useHistory();

  const [resellers, setResellers] = useState([]);

  useEffect(() => {
    api.get("reseller", {}).then((response) => {
      setResellers(response.data);
    });
  }, []);

  const showError = (error) => {
    toast.error(error, {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const showSuccess = () => {
    toast.success('Representante Removido', {
      position: "top-right",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  async function handleDeleteReseller(resellerId){
    if(window.confirm('Deseja Realmente deletar o Representante')){
      await api
        .delete(`reseller/${resellerId}`)
        .then((response) => {
          showSuccess();
          setResellers(resellers.filter((reseller) => reseller.id !== resellerId));
        })
        .catch((error) => {
          showError(error);
        });
    }
  }

  return (
    <>
      <Container>
        {resellers.map((reseller) => (            
          <Card>
          <ItemsContainer>
            <HeaderText>{reseller.name}</HeaderText>
            <ActionButtonsContainer>
              <IconButton onClick={() => alert("Em Produção")}>
                <FontAwesomeIcon
                  style={{ marginRight: 15 }}
                  icon={faPen}
                  size="1x"
                  color="DodgerBlue"
                />
              </IconButton>
              <IconButton onClick={() => handleDeleteReseller(reseller.id)}>
                <FontAwesomeIcon
                  style={{ marginRight: 15 }}
                  icon={faTrash}
                  size="1x"
                  color="FireBrick"
                />
              </IconButton>
            </ActionButtonsContainer>
          </ItemsContainer>
        </Card>
        ))}
        
        <NewButton onClick={() => history.push("/novo/representante")}>
          Novo Representante
        </NewButton>
      </Container>

      <Navbar />
    </>
  );
}

export default ResellerList;
