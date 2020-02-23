import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { TarefasToolbar, TarefasTable } from './components';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core'



const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const API_URL = 'https://minhastarefas-api.herokuapp.com/tarefas';

const TarefasList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [open, setOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const salvar = (tarefa) => {
    axios.post(API_URL, tarefa, {
      headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
    }).then(response => {
      const novaTarefa = response.data;
      setTarefas([...tarefas, novaTarefa])
      setMensagem('Salvo com sucesso');
      setOpen(true);
    }).catch(err => {
      setMensagem('Ocorreu um erro');
      setOpen(true);
    })
  }

  const listarTarefas = () => {
    axios.get(API_URL, {
      headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
    }).then(response => {
      const listDeTarefas = response.data;
      setTarefas(listDeTarefas);
    }).catch(err => {
      setMensagem('Ocorreu um erro');
      setOpen(true);
    })
  }

  const alterarStatus = id => {
    axios.patch(`${API_URL}/${id}`, null, {
      headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
    }).then(response => {
      const lista = [...tarefas];
      lista.forEach(tarefa => {
        if (tarefa.id === id) {
          tarefa.done = true;
        }
      })
      setTarefas(lista);
      setMensagem('Tarefa completada. Parábens!');
      setOpen(true);
    }).catch(err => {
      setMensagem('Ocorreu um erro');
      setOpen(true);
    })
  }

  const deletar = id => {
    axios.delete(`${API_URL}/${id}`, {
      headers: { 'x-tenant-id': localStorage.getItem('email_usuario_logado') }
    }).then(response => {
      const lista = tarefas.filter(tarefa => tarefa.id !== id);
      setTarefas(lista);
      setMensagem('Deletado com sucesso');
      setOpen(true);
    }).catch(err => {
      setMensagem('Ocorreu um erro');
      setOpen(true);
    })
  }

  useEffect(() => {
    listarTarefas();
  }, [])

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable alterarStatus={alterarStatus} tarefas={tarefas} deleteAction={deletar} />
      </div>
      <Dialog open={open} onClose={e => setOpen(false)}>
        <DialogTitle>Mensagem do Sistema</DialogTitle>
        <DialogContent>{mensagem}</DialogContent>
        <DialogActions>
          <Button onClick={e => setOpen(false)} >Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TarefasList;
