import { Container } from "@inlet/react-pixi";
import { UText } from "./util";

const jsonContainer = (props) => {
  const jsons = [];
  const gProps = {
    line: props.line, depth: props.depth, posX: props.posX
  };
  if (props.posX === 0)
    jsons.push(<LineNumText key={`${gProps.line}/-3`}
      x={props.x} y={props.y} lH={props.lH} line={gProps.line}
    />);
  if (props.json instanceof Object) {
    jsons.push(<TextAt key={`${gProps.line}/${gProps.posX}`}
      text={(props.json instanceof Array) ? '[' : '{'} col={0x000000}
      x={props.x} y={props.y} lH={props.lH}
      line={gProps.line} posX={gProps.posX}
    />);
    gProps.line++;gProps.depth++;
    const keys = (props.json instanceof Array) ?
      Array.from({length: 10}, (_, i) => i) :
      ['title', 'data', 'name', 'url', 'description'];

    let f = false;
    for (const key of keys) {
      if (!(key in props.json)) continue;
      if (f) {
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={','} col={0x000000}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.line++;
      }
      jsons.push(<LineNumText key={`${gProps.line}/-3`}
        x={props.x} y={props.y} lH={props.lH} line={gProps.line}
      />);
      gProps.posX = gProps.depth*2;
      if (!(props.json instanceof Array)) {
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={`"${key}"`} col={0x007700}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.posX += key.length+2;
        jsons.push(
          <TextAt key={`${gProps.line}/${gProps.posX}`}
            text={':'} col={0x000000}
            x={props.x} y={props.y} lH={props.lH}
            line={gProps.line} posX={gProps.posX}
          />
        );
        gProps.posX += 2;
      }
      let cJson;
      [gProps.posX, gProps.line, cJson] = jsonContainer(Object.assign({
        x: props.x, y: props.y, lH: props.lH, json: props.json[key]
      }, gProps));
      jsons.push(cJson);
      f = true;
    }
    gProps.line++;gProps.depth--;

    jsons.push(<LineNumText key={`${gProps.line}/-3`}
      x={props.x} y={props.y} lH={props.lH} line={gProps.line}
    />);
    gProps.posX = gProps.depth*2;
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={(props.json instanceof Array) ? ']' : '}'} col={0x000000}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
      />
    );
    return [gProps.posX+1, gProps.line,
      <Container key={`c${gProps.line}/${gProps.posX}`}>
        {jsons.map((e, _) => e)}
      </Container>
    ];
  }
  if (props.json.includes('.')) {
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={`"${props.json}"`} col={0x0077FF}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
        interactive={true} buttonMode={true}
        pointertap={() => window.open(`https://${props.json}`, '_blank')}
      />
    );
  } else {
    jsons.push(
      <TextAt key={`${gProps.line}/${gProps.posX}`}
        text={`"${props.json}"`} col={0xCC4400}
        x={props.x} y={props.y} lH={props.lH}
        line={gProps.line} posX={gProps.posX}
      />
    );
  }
  return [gProps.posX+props.json.length+2, gProps.line,
    <Container key={`c${gProps.line}/${gProps.posX}`}>
      {jsons.map((e, _) => e)}
    </Container>
  ];
}

const JsonContainer = (props) => {
  const jC = jsonContainer(props);
  return (
    <>
     {jC[2]}
      {[...Array(props.lines-jC[1])].map((_, i) => (
      <LineNumText key={`${jC[1]+1+i}/-3`}
        x={props.x} y={props.y} lH={props.lH} line={jC[1]+1+i}
      />
    ))}
    </>
  )
}

const LineNumText = (props) => {
  return (
    <TextAt text={`${('  ' + props.line).slice(-2)}`} col={0x666666}
      x={props.x} y={props.y} lH={props.lH} line={props.line} posX={-3}
    /> 
  )
}

const TextAt = (props) => {
  return (
    <UText text={props.text} col={props.col}
      x={props.x+(3+props.posX)*props.lH*0.48}
      y={props.y+props.lH*(props.line-0.9)}
      h={props.lH*0.8}
      interactive={props.interactive || false} buttonMode={props.buttonMode || false}
      pointertap={props.pointertap || false}
    />
  )
}

export { JsonContainer, LineNumText };