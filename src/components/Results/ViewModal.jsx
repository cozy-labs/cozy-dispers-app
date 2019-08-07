import React, { Component } from 'react'

import Button from 'cozy-ui/react/Button'
import { Modal, ModalContent } from 'cozy-ui/react'

export class ViewModal extends Component {
  constructor(props, context) {
    super(props, context)
    // initial component state
    this.state = {
      boolModal: false
    }
  }

  render() {
    const { boolModal } = this.state
    const { training } = this.props
    return (
      <div>
        {boolModal ? (
          <div>
            <Button
              onClick={() => this.setState({ boolModal: true })}
              label="more details"
              size="large"
              extension="narrow"
            />
            <Modal
              title="Details about your training"
              secondaryAction={() => {
                this.setState({ boolModal: false })
              }}
            >
              <ModalContent>
                <div>
                  <center>
                    <table className="tg">
                      <tr>
                        <th>
                          <b>Name :</b>
                        </th>
                        <th>{training.name}</th>
                      </tr>
                      <tr>
                        <th>
                          <b>Status :</b>
                        </th>
                        <th>{training.status}</th>
                      </tr>
                      <tr>
                        <th>
                          <b>Doctype :</b>
                        </th>
                        <th>{training.localquery.value}</th>
                      </tr>
                      {training.results && (
                        <tr>
                          <th>
                            <b>Results :</b>
                          </th>
                          <th>{training.results}</th>
                        </tr>
                      )}
                    </table>
                    <br />
                  </center>
                </div>

                <img src="ia.jpg" width="200px" />

                <hr />

                <p>Target profile : </p>

                <small>{training.targetProfile}</small>
                <br />
                <br />

                {(training => {
                  var out = []
                  training.layers_da.forEach(function(item, index) {
                    out.push(<hr />)
                    out.push(<p>Layer n°{index} :</p>)
                    out.push(
                      <div>
                        <center>
                          <table className="tg">
                            <tr>
                              <th> Function : </th>
                              <th>{item.layer_job.func.value}</th>
                            </tr>
                            <tr>
                              <th> Size : </th>
                              <th>{item.layer_size} DAs</th>
                            </tr>
                            <tr>
                              <th> Keys : </th>
                              <th>{item.layer_job.args.keys}</th>
                            </tr>
                            {item.layer_job.args.weight && (
                              <tr>
                                <th> Weight : </th>
                                <th>{item.layer_job.args.weight}</th>
                              </tr>
                            )}
                          </table>
                        </center>
                      </div>
                    )
                  })
                  return out
                })(training)}
                <hr />
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <Button
            onClick={() => this.setState({ boolModal: true })}
            label="More details"
            size="large"
            extension="narrow"
          />
        )}
      </div>
    )
  }
}

// get mutations from the client to use createDocument
export default ViewModal
