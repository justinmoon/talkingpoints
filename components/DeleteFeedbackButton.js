import React, { useState, useRef } from "react"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Button,
} from "@chakra-ui/core"
import { mutate } from "swr"

import { deleteFeedback } from "utils/db"
import { useAuth } from "utils/auth"

const DeleteFeedbackButton = ({ feedbackId }) => {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState()
  const cancelRef = useRef()
  const onClose = () => setIsOpen(false)
  const onDelete = () => {
    deleteFeedback(feedbackId)
    // mutate(
    //   ["/api/feedback", auth.user.token],
    //   async (data) => {
    //     console.log("data", data)
    //     return {
    //       feedback: data.feedback.filter(
    //         (feedback) => feedback.id !== feedbackId
    //       ),
    //     }
    //   },
    //   false
    // )
    onClose()
  }
  return (
    <>
      <IconButton
        aria-label="Delete feedback"
        icon="delete"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Feedback
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              fontWeight="bold"
              variantColor="red"
              onClick={onDelete}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteFeedbackButton
