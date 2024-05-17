function jsonToMermaid(json) {
  let result = `graph TD\n`;

  function parseSequential(node, parent) {
      node.sequentialSteps.forEach((step, index) => {
          let shape = "rectangle";
          let nextStep = `step${parent}_${index + 1}`;
          if (step.component) {
              result += `${nextStep}(${step.component})[${shape}]\n`;
          } else {
              parseParallel(step, nextStep);
          }
          if (index > 0) {
              result += `step${parent}_${index} --> ${nextStep}\n`;
          }
      });
  }

  function parseParallel(node, parent) {
      let parallelStart = `subparallel_${parent}`;
      result += `subgraph ${parallelStart}[${parent}]\n`;
      result += `direction LR\n`;
      node.parallelSteps.forEach((step, index) => {
          let shape = "rectangle";
          let nextStep = `parallel_step_${parent}_${index}`;
          if (step.component) {
              result += `${nextStep}(${step.component})[${shape}]\n`;
          } else {
              parseConditional(step, nextStep);
          }
          if (index === 0) {
              result += `${parent} -->${nextStep}\n`;
          }
      });
      result += `end\n`;
  }

  function parseConditional(node, parent) {
      node.conditionSteps.forEach((step, index) => {
          let shape = "diamond";
          let conditionStep = `condition_${parent}_${index}`;
          result += `${conditionStep}(${step.predicateClassName || "Default"})[${shape}]\n`;
          if (index === 0) {
              result += `${parent} -->${conditionStep}\n`;
          }
          let nextStep = `step_after_condition_${parent}_${index}`;
          if (step.componentStep.component) {
              result += `${nextStep}(${step.componentStep.component})\n`;
              result += `${conditionStep} -->${nextStep}\n`;
          } else {
              parseSequential(step.componentStep, nextStep);
              result += `${conditionStep} -->${nextStep}\n`;
          }
      });
  }

  parseSequential(json, "start");

  return result;
}

// 示例 JSON
let workflowJson = {
  "type": "SEQUENTIAL",
  "sequentialSteps": [
      {
          "type": "PARALLEL",
          "parallelSteps": [
              {
                  "component": "COMPONENT_G"
              },
              {
                  "type": "CONDITIONAL",
                  "conditionSteps": [
                      {
                          "conditionStep": 1,
                          "predicateClassName": "com.xiaopeng.workflow.components.predict.MultiPredicate.IF_COMPONENT_V_CASE",
                          "componentStep": {
                              "type": "SEQUENTIAL",
                              "sequentialSteps": [
                                  {
                                      "component": "COMPONENT_TAG"
                                  },
                                  {
                                      "component": "COMPONENT_GEN"
                                  }
                              ]
                          }
                      },
                      {
                          "conditionStep": 2,
                          "componentStep": {
                              "component": "COMPONENT_I"
                          }
                      }
                  ]
              }
          ]
      }
  ]
};

console.log(jsonToMermaid(workflowJson));
