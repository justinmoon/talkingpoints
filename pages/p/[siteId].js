import { useRef, useState } from "react"
import { useRouter } from "next/router"
import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/core"

import { useAuth } from "utils/auth"
import { getAllFeedback, getAllSites } from "utils/db-admin"
import { createFeedback } from "utils/db"
import Feedback from "components/Feedback"

export async function getStaticProps(context) {
  const siteId = context.params.siteId
  const { feedback } = await getAllFeedback(siteId)
  return {
    props: {
      initialFeedback: feedback,
    },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const { sites } = await getAllSites()
  const paths = sites.map((site) => ({
    params: {
      siteId: site.id.toString(),
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

const FeedbackPage = ({ initialFeedback }) => {
  if (initialFeedback == undefined) {
    return <div />
  }
  const router = useRouter()
  const auth = useAuth()
  const inputEl = useRef(null)
  const [allFeedback, setAllFeedback] = useState(initialFeedback)

  const onSubmit = (e) => {
    e.preventDefault()
    const newFeedback = {
      author: auth.user.name,
      authorId: auth.user.uid,
      siteId: router.query.siteId,
      text: inputEl.current.value,
      createdAt: new Date().toISOString(),
      provider: auth.user.provider,
      status: "pending",
    }
    inputEl.current.value = ""
    setAllFeedback([newFeedback, ...allFeedback])
    createFeedback(newFeedback)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="full"
      maxWidth="700px"
      margin="0 auto"
    >
      {auth.user && (
        <Box as="form" onSubmit={onSubmit}>
          <FormControl my={8}>
            <FormLabel htmlFor="comment">Comment</FormLabel>
            <Input ref={inputEl} id="comment" placeholder="Leave a comment" />
            <Button mt={4} type="submit" fontWeight="medium">
              Add Comment
            </Button>
          </FormControl>
        </Box>
      )}
      {allFeedback &&
        allFeedback.map((feedback) => (
          <Feedback key={feedback.createdAt} {...feedback} />
        ))}
    </Box>
  )
}

export default FeedbackPage
