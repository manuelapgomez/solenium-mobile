Estoy diseñando una aplicación de monitoreo para los usuarios en minigranjas, esta aplicación nativa será usada para:  registro de usuarios, registro de la asistencia de dichos usuarios, seguimiento de tareas y novedades en campo y generación de reportes para inversionistas.

- Ya existen desarrollos particulares que se encargan de eso, pero son individuales, así que decidimos agrupar todas las funciones en un mismo espacio para que todo el personal de construcción en las minigranjas estén sincronizados.

La lista es larga de lo que podrán hacer en esta app pero las principales acciones para las que ya tenemos un flujo consolidado son:

1) Constructometro: en esta los usuarios tienen tareas diarias asignadas que van cumpliendo y mientras desarrollan, van dejando el registro de lo que se hizo al final del dia y registro de novedades como inconvenientes que paran una actividad  
     
2) FACE ID: este desarrollo se centra en la capacidad de registrar al personal en campo y una forma de reconocer su asistencia a los proyectos a través de una captura de rostro cada que se encuentra en el sitio del proyecto, inicia sesión captura su cara con la mano arriba.  
     
   la idea de este es consolidar una base de datos de contratistas, ingenieros y en general personal en campo, que rotan entre proyectos y realizan actividades contabilizables para garantizar el debido pago y reconocimiento de sus horas extras, así como la falta de las mismas horas establecidas en sus contratos, este registro debe hacerse al inicio y final del dia.

   

Estos desarrollos estarán dentro de la capacidad de la app solenium y empezaremos a desarrollar en el faceid refactorizando la experiencia de usuario y reconstruyendo el paradigma de navegación, curva de aprendizaje y apropiación de nuevos hábitos disciplinados.

- este es una especie de”record” de ideas para dejar por escrito el hilo conductor:   
1. Por ahora necesito crear un espacio de interacción simple que me permita tomar una foto al inicio y al final de la jornada.

2. quiero que se limite a una acción natural, en una única vista, optimizada para celular y que su feature de registro de usuarios en un mismo celular sea relegada en jerarquía, aún muy importante pero no la principal  
   

Para la app solenium existe un tipo de usuario por capas, parecido al usuario solenium (que va de admin con todos los permisos hasta el que solo tiene visualización de lo mínimo) la app tiene un usuario con acceso a toda la información de campo y hay usuarios que tienen dicha información personalizada a su área, enfoque y necesidades.

el concepto base es “Una bitácora de campo” como los cuadernos que se suelen tener para registrar el día a día de una construcción, exploración o proceso de creación desde la antigüedad con el objetivo de recopilar conocimiento empírico que puede ser de utilidad para replicar los procedimientos en el futuro y evidenciar el paso del tiempo, tecnologías, errores y aciertos de un mega proyecto.

ahora, dicho concepto tiene el reto de romper con barreras cognitivas altas, por un lado espero cierto nivel de familiaridad de parte de los usuarios con mayores accesos PERO el usuario principal y en quien pongo todos mis esfuerzos en descifrar una navegación simple es el usuario normal de campo: aquel usuario contratista que entra en la mañana, trabaja en lo que se le asignó, y sale por la tarde de un proyecto o varios.

asi pues, la cotidianidad de un usuario se va a ver medida con nuestro software que nace de hacer trazabilidad de las actividades en campo para incrementar el control y asi optimizar los tiempos de construcción, nuestro ideal se ve asi:

todos los usuarios por la mañana muy 8am, llegan al proyecto que tienen asignado para trabajar ese dia, se presentan y abren su app, en esta deben ingresar el check in, tomandose una foto con la mano arriba para que un bot identifique el lugar y la persona donde estan y guarde su hora de ingreso.

después de esto, esta persona, que es un usuario medio, es decir, no tiene poder de asignar las tareas, a él se las asignan, pero tiene personas a su cargo que le ayudan a cumplir y que no necesitan hacer un seguimiento más extenso que el check in and out, tiene unas actividades que puede hacer y está asignado para cumplir en cierta medida de tiempo y con cierta cantidad de material, como por ejemplo hacer huecos en el suelo con una maquinaria pesada para luego poner los paneles. Así que lo ve en su agenda, y dice, “hora de comenzar”

Después de dedicarle una jornada de 10h por ejemplo, llega el final del día y este usuario debe registrar el avance, hasta donde llegó con  esa actividad, digamos que de 100 huecos que debe hacer en 1 semana, el lunes que ingresó hizo 25, eso debe registrarlo para llevar un avance, dia a dia (y crear un reporte fiel para los inversionistas, que piden transparencia en los procesos, materiales consumidos y compromiso de los trabajadores)

Pero, resulta que ese día justo tenía que ¡avanzar con 50 huecos\! y solo hizo 25, ¿qué pasó? \- el usuario debe registrar una novedad, contarle al revisor de la bitácora que está llenando qué fue lo que pasó; como estamos en colombia, hay interferencias y novedades como LLuvia y condiciones climáticas que impidieron el desarrollo de la tarea, tambien puede darse una falta de suministro o una interferencia técnica como falta de conexión a starklink, u otro tipo de novedades. asi que nuestro usuario, reportó la novedad.

pero su avance y su novedad no son nada sin evidencias\! ¡Necesitamos fotos\! fotos que muestran los huecos, que muestran la lluvia y como va avanzando el proyecto, para poder trazar una línea de tiempo visual y literal de la construcción de una minigranja solar, además de construir un reporte fidedigno, claro y transparente.

Listo, nuestro usuario logró el registro de la actividad que hizo en el dia, es momento de hacer check out, de la misma manera en que ingresamos, con una foto con mano arriba y así registrar cuántas horas estuvo dedicado a trabajar y poder reconocer el salario que le corresponde.

resulta que, en colombia la regulación implica un horario laboral de 8h \+ una de almuerzo, lo que va de 8am a 6pm por lo general en la extensión del territorio, eso para los oficinistas va muy bien, pero  para los trabajadores en campo es menos controlable, nosotros necesitamos el registro de check in and out para poder reconocer las horas extra de los trabajadores y pagar lo que corresponde a nivel de la ley.

pero no solo eso, resulta que el perfil de nuestro personal en campo no solo es importante y principal por su familiaridad con la tecnología; esta familiaridad de la que hablo esta profundamente marcada por el bagaje cultural, capacidad adquisitiva, de alfabetización y acceso a tecnología que es diferente a los de las grandes ciudades; los usuarios no tienen celular de última generación, en repetidas ocasiones no están al día con las últimas tendencias de uso de redes sociales o plataformas digitales,  en algunas ocasiones no tienen un celular.

Por esto, este desarrollo tiene la capacidad de hacer check in and out desde un mismo celular, donde se registran los varios usuarios con un walkthrough de reconocimiento facial extenso y pueden ya ir cambiando de perfiles para hacer el registro de ingreso y salida, cuya limitación es, la ubicación.

Esta aplicación también es nativa del teléfono, por lo que guarda los datos del usuario y le permite tener una base de datos de registros como un calendario para medir su trabajo.

bueno,  ese es el usuario más común, pero a la par del desarrollo móvil, existe un mundo de gestión que llamamos “solarverso” en este coexisten desarrollos de cronogramas, para la gestión integral de cientos de minigranjas en el país, cronogramas medidos con actividades precisas y predecibles, asi como estados de avance legislativo y conceptual que eventualmente llevan a la construcción.

cual es el objetivo de todo eso? llenar unos reportes diarios y semanales de la construcción de minigranjas solares, reportes que entregan a sus destinatarios un porcentaje de avance medido con respecto al cumplimiento de actividades e hitos en cronograma, una justificación matemática del gasto de inversión, conteo de las horas destinadas para el contraste final con lo pactado en el contrato.  
 estados de avance según las áreas necesarias en un proyecto como lo es en el área de ingeniería:  general, civil, mecánica, eléctrica y comunicaciones  y en el área de construcción: adecuación, cimentaciones, electromecánica, instalación DC y AC, en medida porcentual.

Rendición de cuentas a equipos como SST y people que mide la disposición de personal, cantidades, que tipo de empresa pertenecen, el género, la maquinaria y los equipos en campo, la mano de obra de la localidad.

También se hace rendición de cuentas a nivel ambiental, con el consumo de agua y energía, gestión social, gestión de evidencias, control de calidad y curva S comparativa de tiempo planeado real y proyección real a  partir de lo que llevan en lo real, y por supuesto de gestión de inventario.

Como se puede ver son muchas áreas y en todo proyecto existe al menos una persona que necesita acceso a todos los reportes y toda la agenda diaria, semanal, mensual y proyectada de las minigranjas y el personal dividido por áreas.

este usuario no solo necesita la app de celular, necesita un espacio de gestión que es el “solarverso” dividido por algo que  llamamos espacios de trabajo, lugares que dividen por áreas a los equipos y les permiten ver bases de datos, analisis comparativos de estas, resúmenes ejecutivos y resultados de ejecución desde una perspectiva de análisis, es decir, totalidades de cumplimiento de actividades en campo, por ejemplo, ver el global de la tarea de hacer huecos y llegar al detalle de ver paso a paso como se ha hecho, ese universo ya existe.

ahora necesitamos el punto de conexión a tierra, nuestros ojos en campo y por eso, la app solenium será el tipo de espacio al que las personas en campo acuden de manera reflejo.