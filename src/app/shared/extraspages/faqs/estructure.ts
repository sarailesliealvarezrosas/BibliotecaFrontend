interface ComplexNode {
    name: string;
    children?: ComplexNode[];
}

export const TREE_DATA: ComplexNode[] = [
  {
    name: 'GAMQ',
    children: [
      {
        name: 'Complejos Deportivos',
        children: [
          {
            name: 'Complejo 1',
            children: [
              {
                name: 'Campo Deportivo 1.1',
                children: [
                  { name: 'Horarios' },
                  { name: 'Tarifas' },
                  { name: 'Categoría' },
                  { name: 'Superficie' }
                ]
              },
              { name: 'Campo Deportivo 1.2' },
              { name: 'Campo Deportivo 1.n' }
            ]
          },
          {
            name: 'Complejo 2',
            children: [
              { name: 'Campo Deportivo 2.1' },
              { name: 'Campo Deportivo 2.2' },
              { name: 'Campo Deportivo 2.n' }
            ]
          },
          {
            name: 'Complejo n',
            children: [
              { name: 'Campo Deportivo n.1' },
              { name: 'Campo Deportivo n.2' },
              { name: 'Campo Deportivo n.n' }
            ]
          }
        ]
      }
    ]
  }
];

export const FAQCategory = [
  {
    title: "Preguntas Generales",
    icon: "ri-question-line",
    faqs: [
      {question: "¿Qué es el sistema de biblioteca?",
        answer: "Es ....."
      }
    
    ]
  },
  {
    title: "Gestión de Cuenta",
    icon: "ri-user-settings-line",
    faqs: [
      {
        question: "¿Qué datos necesito proporcionar para mi registro?",
        answer: "Necesitas proporcionar: 1) Información personal: nombres, apellidos, fecha nacimiento, género y estado civil 2) Documento de identidad: tipo, número y lugar de expedición 3) Información de contacto: celular y correo electrónico 4) Opcionalmente: dirección y NIT."
      },
      {
        question: "¿Puedo modificar mis datos después del registro?",
        answer: "Puedes modificar tu información de contacto y datos opcionales, sin embargo, los datos de identificación (tipo de documento, número y expedición) no pueden ser modificados después del registro inicial debido a la integración con el sistema RUAT."
      },
    ]
  },
  {
    title: "Privacidad y Seguridad",
    icon: "ri-shield-keyhole-line",
    faqs: [
      {
        question: "¿?",
        answer: ""
      }
    ]
  }
];
